<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Character;
use App\Models\Rating;
use App\Http\Requests\CharacterRequest;

class CharacterApiController extends Controller
{
    /**
     * キャラクター一覧表示
     */
    public function index()
    {
        $list = Character::get();

        $res = [
            'status' => 'success',
            'character' => $list
        ];
        return response($res, 200);
    }

    /**
     * キャラクター詳細表示
     */
    public function show(int $id)
    {
        $character = Character::find($id);
        if(! $character) {
            return response(['status' => 'failure', 'message' => 'キャラクターが存在しません'], 404);
        }
        $res = [
            'status' => 'success',
            'character' => $character
        ];
        return response($res, 200);
    }

    /**
     * キャラクター成長 一項目100点(max:400)で実装
     */
    public function update(CharacterRequest $request, int $id)
    {
        // チャラクターが存在するか
        $character = Character::find($id);
        if(! $character) {
            return response(['status' => 'failure', 'message' => 'キャラクターが存在しません'], 404);
        }
        
        // リクエスト取得
        $req = $request->all();
        $rating = Rating::find($req['rating_id']);
        if(!$rating) {
            return response(['status' => 'failure', 'message' => '評価が存在しません'], 400);
        }
        if($rating->isserve) {
            return response(['status' => 'failure', 'message' => 'すでに使用された評価です'], 400);
        }
        $rating['isserve'] = true;
        $rating->save();
        $point = $character->point + $req['point'];
        $level = $character->level;

        $levelBorder = [10000, 6500, 4000, 2000, 600]; //TeamApiController

        // レベルアップの計算
        if($point >= $levelBorder[0]) {
            $level = 6;
        }
        else if($point >= $levelBorder[1]) {
            $level = 5;
        }
        else if($point >= $levelBorder[2]) {
            $level = 4;
        }
        else if($point >= $levelBorder[3]) {
            $level = 3;
        }
        else if($point >= $levelBorder[4]) {
            $level = 2;
        }
        $character->level = $level;
        $character->point = $point;


        // レベルに応じて画像を変える？？
        // -----変更してレスポンスを返す
        $character->save();
        $res = [
            'status'  => 'success',
            'character' => $character
        ];
        return response($res, 200);
        
    }
}
