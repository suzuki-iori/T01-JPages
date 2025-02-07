<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Student;
use App\Models\User;

class AdminStudentTokenAuth
{
    /**
     * Handle an incoming request.
     *
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
        $user = User::where('token', $token)->first();
        if(!$student && !$user) {
            // ユーザー不明エラー
            return response(["status" => "TokenError", "message" => "認証できません"], 401);
        }
        if($student) {
            $student['type'] = 'student';
            $request->merge(['login_admin_student' => $student]);
        }
        else if($user) {
            $user['type'] = 'admin';
            $request->merge(['login_admin_student' => $user]);
        }
        
        return $next($request);
    }
}
