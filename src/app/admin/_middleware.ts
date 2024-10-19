// src/app/admin/_middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '../../utils/supabaseClient';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}