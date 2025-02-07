<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Student;

class StudentTokenAuth
{
    /**
     * 学生認証
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        if (!$token) {
            // トークンなしエラー
            return response(["status" => "TokenError", "message" => "認証できません"], 401);
        }
        $student = Student::where('token', $token)->first();
        if (!$student) {
            // ユーザー不明エラー
            return response(["status" => "TokenError", "message" => "認証できません"], 401);
        }
        $request->merge(['login_student' => $student]);
        return $next($request);
    }
}
