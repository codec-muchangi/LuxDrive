"""
LUXDRIVE — Supabase Backend Client

Creates and returns the Supabase client using the SERVICE ROLE KEY.
This key bypasses Row Level Security and must NEVER be exposed
to the frontend or committed to Git.

Usage:
    from app.database.supabase import get_supabase_client
    client = get_supabase_client()
"""

from functools import lru_cache
from supabase import create_client, Client
from app.core.config import get_settings


@lru_cache()
def get_supabase_client() -> Client:
    """
    Returns a cached Supabase client using the service role key.
    This client has full database access (bypasses RLS).
    Use only in server-side FastAPI code.
    """
    settings = get_settings()

    client = create_client(
        supabase_url=settings.SUPABASE_URL,
        supabase_key=settings.SUPABASE_SERVICE_ROLE_KEY,
    )
    return client


@lru_cache()
def get_supabase_anon_client() -> Client:
    """
    Returns a Supabase client using the ANON KEY.
    This client respects Row Level Security.
    Use for operations that should be scoped to RLS policies.
    """
    settings = get_settings()

    client = create_client(
        supabase_url=settings.SUPABASE_URL,
        supabase_key=settings.SUPABASE_ANON_KEY,
    )
    return client


# Convenience aliases
supabase: Client = get_supabase_client()
