<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \Hash;
use App\Models\Student;
use App\Models\User;
use App\Http\Requests\AdminAuthRequest;
use App\Http\Requests\StudentAuthRequest;

class AuthController extends Controller
{
    /**
     * 管理者ログイン処理
     */
    public function login(AdminAuthRequest $request)
    {
        $req = $request->all();
        $user = User::where('account', $req['account'])->first();
        if (!$user) {
            // いなければエラー
            return response(["status" => "failure", "message" => "アカウントまたはパスワードが違います"], 401);
        }
        // パスワードチェック
        if (! Hash::check($req['password'], $user->password)) {
            // 一致してなければエラー
            return response(["status" => "failure", "message" => "アカウントまたはパスワードが違います"], 401);
        }
        $user->token = md5(uniqid(rand(), true));
        $user->update();
        return response([
            "status" => "success",
            "token" => $user->token
        ], 200);
    }

    /**
     * ログアウトする
     */
    public function logout(Request $request) 
    {
        $userId = $request['login_user']->id;
        $user = User::find($userId);

        if (!$user) {
            return response(["status" => "failure", "message" => "認証できませんでした"], 401);
        }

        $user->token = '';
        $user->update();

        return response(["status" => "success"], 200);
    }

    /**
     * 学生アプリ認証
     */
    public function studentAuth(StudentAuthRequest $request)
    {
        $req = $request->all();
        $student = Student::where('number', $req['number'])
                            ->where('name', $req['name'])
                            ->first();

        if (!$student) {
            return response(["status" => "failure", "message" => "学籍番号と氏名が一致しません"], 401);
        }
        // if($student->token) {
        //     return response(["status" => "failure", "message" => "このアカウントは既にログインしています。管理者に問い合わせてください。"], 401);
        // }
        $student->token = md5(uniqid(rand(), true));
        $student->update();
        return response(["status" => "success", "token" => $student->token, "team_id" => $student['team_id']], 200);
    }
}
