<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Visitor;
use App\Http\Requests\VisitorRequest;


class VisitorApiController extends Controller
{
    /**
     * 来場者一覧表示
     */
    public function index()
    {
        $list = Visitor::get();
        $res = [
            'status' => 'success',
            'visitor' => $list
        ];
        return response($res, 200);
    }

    /**
     * 来場者登録
     */
    public function store(VisitorRequest $request)
    {
        $req = $request->all();
        // トークンを生成
        $token = md5(uniqid(rand(), true));
        $req['token'] =  $token;
        $res = Visitor::create($req);
        return response(['status' => 'success', 'token' => $token], 201);
    }

    /**
     * 来場者詳細取得
     */
    public function show(int $id)
    {
        $visitor = Visitor::with(['ratings'])->find($id);
        if(! $visitor) {
            return response(['status' => 'failure', 'message' => '来場者が存在しません'], 404);
        }
        $visitor->makeHidden('token');
        $res = [
            'status' => 'success',
            'visitor' => $visitor
        ];
        return response($res, 200);
    }

    /**
     * 来場者情報更新
     */
    public function update(VisitorRequest $request)
    {
        $token = $request['login_visitor']->token;
        $visitor = Visitor::where('token', $token)->first();
        if(!$visitor) {
            return response(['status' => 'failure', 'message' => '来場者が存在しません'], 404);
        }

        // データの更新
        $req = $request->all();
        $visitor->affiliation = $req['affiliation'];
        $visitor->name = $req['name'];
        $visitor->email = $req['email'];
        $visitor->update();

        return response(["status" => "success"], 200);
    }

    /**
     * 来場者消去
     */
    public function destroy(int $id)
    {
        $visitor = Visitor::with(['ratings'])->find($id);
        if (!$visitor) {
            return response(['status' => 'failure', 'message' => '来場者が存在しません'], 404);
        }

        // 一度でも評価されている場合
        if (!$visitor->ratings->isEmpty()) {
            return response(['status' => 'failure', 'message' => 'すでに投票をしているため消去できません'], 400);
        }
        // アンケートが投稿されてる場合
        // if() {

        // }

        $visitor->delete();
        return response(['status' => 'success', 'id' => $id], 200);
    }
}