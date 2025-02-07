<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Student;
use App\Models\Visitor;

class VisitorStudentTokenAuth
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
        $visitor = Visitor::where('token', $token)->first();
        if(!$student && !$visitor) {
            // ユーザー不明エラー
            return response(["status" => "TokenError", "message" => "認証できません"], 401);
        }
        if($student) {
            $student['type'] = 'student';
            $request->merge(['login_student_visitor' => $student]);
        }
        else if($visitor) {
            $visitor['type'] = 'visitor';
            $request->merge(['login_student_visitor' => $visitor]);
        }
        return $next($request);
    }
}
