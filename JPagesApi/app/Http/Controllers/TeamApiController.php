<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Team;
use App\Models\Character;
use App\Models\Parameter;
use App\Http\Requests\TeamRequest;
use App\Http\Requests\IspresentRequest;

class TeamApiController extends Controller
{
    /**
     * チーム一覧
     */
    public function index()
    {
        $list = Team::get()->makeHidden(['detail']);
        $res = [
            'status' => 'success',
            'team' => $list
        ];
        return response($res, 200);
    }

    /**
     * アプリ用学生一覧
     */
    public function app(Request $request)
    {
        $list = Team::with(['character'])->get()->makeHidden(['detail']);

        // レスポンスの準備
        $res = [
            'status' => 'success',
            'team' => $list
        ];

        return response($res, 200);
    }

    /**
     * チーム登録
     */
    public function store(TeamRequest $request)
    {
        $req = $request->all();
        $num = $request->input('num', 'null'); // デフォルト値を 'null' に設定
        $name = $request->input('name', 'null');
        $detail = $request->input('detail', 'null');
        $grade = $request->input('grade', 'null');
        $file = $request->hasFile('logo') ? $request->file('logo')->getClientOriginalName() : 'null';

        // 画像保存用の年計算
        if($request->hasFile('logo')) {
            $year = date('Y');
            if(date('n') >= 4) {
                $year++;
            }
            // 画像の名前を定義
            $path = '/var/www/app/assets/img/logo' . $year;

            $fileName = $num . '.png';
            $request->file('logo')->move($path, $fileName);
        }
        $team = Team::create($request->only(['num', 'name', 'detail', 'grade']));
        // キャラクターの追加
        $characterType = ['cat', 'dog', 'Rabbits', 'squirrel', 'horse', 'sheep', 'hamsters', 'bear', 'penguin', 'mouse', 'pig', 'lion'];
        Character::create([
            'team_id' => $team->id,
            'level' => 1,
            'point' => 0,
            'type' => $characterType[random_int(0, count($characterType) - 1)]
        ]);
        // パラメーターの追加
        $parameters = [
            ['team_id' => $team->id, 'name' => '元気', 'score' => 30],
            ['team_id' => $team->id, 'name' => 'やる気', 'score' => 60],
            ['team_id' => $team->id, 'name' => '自身', 'score' => 60],
            ['team_id' => $team->id, 'name' => '仲の良さ', 'score' => 100],
            ['team_id' => $team->id, 'name' => 'イケメン率', 'score' => 5],
            ['team_id' => $team->id, 'name' => '彼女ほしい', 'score' => 120]
        ];
        foreach ($parameters as $parameter) {
            $team->parameters()->create($parameter);
        }
        return response(['status' => 'success', 'id' => $team->id], 201);
    }


    /**
     * チーム詳細表示
     */
    public function show(int $id)
    {
        // チームが存在するか
        $team = Team::with(['students', 'character', 'parameters'])->find($id);
        if(! $team) {
            return response(['status' => 'failure', 'message' => 'チームが存在しません'], 404);
        }
        // responseの編集
        $team['students']->makeHidden(['team_id', 'number', 'token', 'created_at']);

        return response([
            'status' => 'success',
            'team' => $team
        ],200);
    }

    /**
     * チームtop用詳細表示
     */
    public function showTop(int $id)
    {
        // チームが存在するか
        $team = Team::with(['character', 'ratings'])->find($id);
        if (! $team) {
            return response(['status' => 'failure', 'message' => 'チームが存在しません'], 404);
        }
        if (! $team->character) {
            return response(['status' => 'failure', 'message' => 'キャラクターが存在しません'], 404);
        }
        // 評価数
        $count = $team->ratings->isEmpty() ? 0 : count($team->ratings);
        $team->count = $count;

        // キャラクターの次のレベル
        $levelBorder = [10000, 6500, 4000, 2000, 600];
        $level = $team->character->level;

        if ($level < 1 || $level > 6) {
            return response(['status' => 'failure', 'message' => 'キャラクターレベルが不正です'], 400);
        }

        $nextLevelBorder = $level >= 6
            ? $levelBorder[0]
            : $levelBorder[5 - $level];

        $team->characterInfo = [
            "id" => $team->character->id,
            "level" => $team->character->level,
            "point" => $team->character->point,
            "type" => $team->character->type,
            "nextLevelBorder" => $nextLevelBorder
        ];
        $team->makeHidden(['ratings', 'character', 'detail']);

        return response([
            'status' => 'success',
            'team' => $team
        ], 200);
    }
    /**
     * チーム情報編集
     */
    public function update(TeamRequest $request, int $id)
    {
        // チームが存在するか
        $team = Team::find($id);
        if (!$team) {
            return response(['status' => 'failure', 'message' => 'チームが存在しません'], 404);
        }

        if($request['login_admin_student']->type == 'student') {
            $teamId = $request['login_admin_student']->team_id;
            // 自分のチームのみ変更可
            if($teamId != $team['id']) {
                return response(['status' => 'Unauthorized', 'message' => '編集権限がありません'], 401);
            }
        }
        // 画像の変更があれば
        // 画像保存用の年計算
        if($request->hasFile('logo')) {
            $year = date('Y');
            if(date('n') >= 4) {
                $year++;
            }
            // 画像の名前を定義
            $path = '/var/www/htmls/public/assets/img/logo/' . $year;

            $fileName = $num . '.png';
            $request->file('logo')->move($path, $fileName);
        }
        // 更新があれば編集
        $team->num = $request->input('num', $team->num);
        $team->name = $request->input('name', $team->name);
        $team->detail = $request->input('detail', $team->detail);
        $team->save();

        return response(['status' => 'success', 'id' => $id], 200);
    }

    /**
     * 発表情報取得
     */
    public function ispresentGet()
    {
        $list = Team::select(['id', 'ispresent'])->get();
        $res = [
            'status' => 'success',
            'team' => $list
        ];
        return response($res, 200);
    }

    /**
     * 発表情報変更
     */
    public function ispresentEdit(IspresentRequest $request, int $id)
    {
        // チームが存在するか
        $team = Team::find($id);
        if (!$team) {
            return response(['status' => 'failure', 'message' => 'チームが存在しません'], 404);
        }

        // パラメーターの編集
        $req = $request->all();
        $team->ispresent = $req['ispresent'];
        $team->save();
        return response(['status' => 'success', 'id' => $id], 200);
    }

    /**
     * チーム削除
     */
    public function destroy(int $id) {
        // チームが存在するか
        $team = Team::with(['students', 'character', 'parameters', 'ratings'])->find($id);
        if (!$team) {
            return response(['status' => 'failure', 'message' => 'チームが存在しません'], 404);
        }

        // 評価がある場合は消去できない
        if(!$team->ratings->isEmpty()) {
            return response(['status' => 'failure', 'message' => 'すでに評価されているため削除できません'], 400);
        }
        // 学生が登録されていても削除できない
        if(!$team->students->isEmpty()) {
            return response(['status' => 'failure', 'message' => '学生が登録されているため削除できません'], 400);
        }


        // キャラクターを消去
        if($team->character) {
            $characterId = $team->character->id;
            $character = Character::find($characterId);
            if($character) {
                $character->delete();
            }
        }

        // パラメータを消去
        if(!$team->parameters->isEmpty()) {
            foreach($team->parameters as $parameter) {
                $paramId = $parameter->id;
                $deleteParam = Parameter::find($paramId);
                if($deleteParam) {
                    $deleteParam->delete();
                }
            }
        }
        // チーム削除
        $team->delete();
        return response(['status' => 'success', 'id' => $id], 200);

    }

    /**
     * チーム発表情報取得
     */
    public function ispresentGetDetail(int $id)
    {
        // チームが存在するか
        $team = Team::select(['id', 'ispresent'])->find($id);
        if (!$team) {
            return response(['status' => 'failure', 'message' => 'チームが存在しません'], 404);
        }
        $res = [
            'status' => 'success',
            'team' => $team
        ];
        return response($res, 200);
    }

    /**
     * ランキング用チーム一覧
     */
    public function getRanking()
    {
        $list = Team::with(['ratings'])->get();
        $list->makeHidden(['detail', 'ispresent']);
        foreach ($list as $team) {
            $total = 0;
            $design = 0;
            $plan = 0;
            $skill = 0;
            $present = 0;
            foreach($team->ratings as $values) {
                $design += $values->design;
                $plan += $values->plan;
                $skill += $values->skill;
                $present += $values->present;
            }
	    $team['count'] = count($team->ratings);
            $total = $design + $plan + $skill + $present;
            $team['design'] = $design;
            $team['plan'] = $plan;
            $team['skill'] = $skill;
            $team['present'] = $present;
            $team['total'] = $total;
        }
        $list->makeHidden(['detail', 'ispresent', 'ratings']);
        return response($list, 200);
    }
}
