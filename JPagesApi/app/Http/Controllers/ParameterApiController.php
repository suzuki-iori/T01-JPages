<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Parameter;
use App\Http\Requests\ParameterRequest;

class ParameterApiController extends Controller
{
    /**
     * パラメーター一覧
     */
    public function index()
    {
        $list = Parameter::get();
        $res = [
            'status' => 'success',
            'student' => $list
        ];
        return response($res, 200);
    }

    /**
     * チームごとのパラメーター表示
     */
    public function listParameters($id)
    {
        $list = Parameter::where('team_id', $id)->get();
        // チームが見つからない場合
        if($list->isEmpty()) {
            return response(['status' => 'failure', 'message' => 'チームが存在しません。'], 404);

        }
        $res = [
            'status' => 'success',
            'student' => $list
        ];
        return response($res, 200);
    }
    
    /**
     * パラメーター編集
     */
    public function update(ParameterRequest $request, int $id)
    {
        $parameter = Parameter::find($id);
        // 存在しなければ
        if(! $parameter) {
            return response(['status' => 'failure', 'message' => 'パラメーターが存在しません。'], 404);
        }

        // 学生の場合、自分のチームのみ変更可
        if($request['login_admin_student']->type == 'student') {
            $teamId = $request['login_admin_student']->team_id;
            if($parameter['team_id'] != $teamId) {
                return response(['status' => 'failure', 'message' => '変更権限がありません'], 401);
            }
        }
        // 更新処理
        $req = $request->all();
        $parameter->update($req);
        return response(['status' => 'success', 'id' => $parameter->id], 200);
    }
}
