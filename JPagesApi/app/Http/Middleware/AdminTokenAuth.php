<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;
class AdminTokenAuth
{
    /**
     * 管理者認証
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        if (!$token) {
            // トークンなしエラー
            return response(["status" => "TokenError", "message" => "認証できません"], 401);
        }
        $user = User::where('token', $token)->first();
        if (!$user) {
            // ユーザー不明エラー
            return response(["status" => "TokenError", "message" => "認証できません"], 401);
        }
        $request->merge(['login_user' => $user]);
        return $next($request);
    }
}
