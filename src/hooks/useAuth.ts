/**
 * Frontend auth + profile + RBAC hook (Lovable Cloud).
 *
 * Owns session state, profile, preferences, and role list for the current
 * user. Business authorization is delegated to the FastAPI backend; this
 * hook only provides UI-level gates (show/hide menu items, route guards).
 */
import { useEffect, useState, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "manager" | "user";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  locale: string;
}

export interface Preferences {
  theme: string;
  language: string;
  sidebar_collapsed: boolean;
  extras: Record<string, unknown>;
}

interface AuthState {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  preferences: Preferences | null;
}

const initial: AuthState = {
  loading: true,
  session: null,
  user: null,
  profile: null,
  roles: [],
  preferences: null,
};

export function useAuth() {
  const [state, setState] = useState<AuthState>(initial);

  const loadAux = useCallback(async (userId: string) => {
    const [{ data: profile }, { data: roles }, { data: prefs }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("user_preferences").select("*").eq("user_id", userId).maybeSingle(),
    ]);
    setState((s) => ({
      ...s,
      profile: (profile as Profile | null) ?? null,
      roles: ((roles as { role: AppRole }[] | null) ?? []).map((r) => r.role),
      preferences: (prefs as Preferences | null) ?? null,
    }));
  }, []);

  useEffect(() => {
    // Subscribe FIRST so we never miss events
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setState((s) => ({ ...s, session, user: session?.user ?? null, loading: false }));
      if (event === "SIGNED_OUT") {
        setState({ ...initial, loading: false });
      } else if (session?.user) {
        // Defer DB reads to avoid deadlocks inside the auth callback
        setTimeout(() => { void loadAux(session.user.id); }, 0);
      }
    });

    // Then fetch the current session
    supabase.auth.getSession().then(({ data }) => {
      setState((s) => ({ ...s, session: data.session, user: data.session?.user ?? null, loading: false }));
      if (data.session?.user) void loadAux(data.session.user.id);
    });

    return () => sub.subscription.unsubscribe();
  }, [loadAux]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const updateProfile = useCallback(async (patch: Partial<Profile>) => {
    if (!state.user) return;
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", state.user.id)
      .select()
      .single();
    if (error) throw error;
    setState((s) => ({ ...s, profile: data as Profile }));
  }, [state.user]);

  const updatePreferences = useCallback(async (patch: Partial<Preferences>) => {
    if (!state.user) return;
    const merged = { ...(state.preferences ?? {}), ...patch };
    const { data, error } = await supabase
      .from("user_preferences")
      .upsert({
        user_id: state.user.id,
        theme: merged.theme,
        language: merged.language,
        sidebar_collapsed: merged.sidebar_collapsed,
        extras: (merged.extras ?? {}) as never,
      })
      .select()
      .single();
    if (error) throw error;
    setState((s) => ({ ...s, preferences: data as unknown as Preferences }));
  }, [state.user, state.preferences]);

  const hasRole = useCallback((role: AppRole) => state.roles.includes(role), [state.roles]);
  const hasAnyRole = useCallback((roles: AppRole[]) => roles.some((r) => state.roles.includes(r)), [state.roles]);

  return {
    ...state,
    isAuthenticated: !!state.user,
    signOut,
    updateProfile,
    updatePreferences,
    hasRole,
    hasAnyRole,
  };
}
