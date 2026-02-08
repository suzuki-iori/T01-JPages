<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating;
use App\Models\Team;
use App\Http\Requests\RatingRequest;

class RatingApiController extends Controller
{
    /**
     * 評価一覧取得
     */
    public function index()
    {
        $list = Rating::with(['Visitor'])->get()->makeHidden(['is_serve']);
        $list->transform(function ($rating) {
            $rating->point = [
                "total" =>$rating->design + $rating->plan + $rating->skill + $rating->present,
                "plan" => $rating->plan,
                "design" => $rating->design,
                "skill" => $rating->skill,
                "present" => $rating->present,
            ];
            $rating->comment = [
                "positive" => $rating->positive,
                "negative" => $rating->negative,
                "other" => $rating->other,
            ];
            return $rating->makeHidden(['design', 'plan', 'skill', 'present', 'positive', 'negative', 'other']);
        });
        $res = [
            'status' => 'success',
            'rating' => $list
        ];
        return response($res, 200);
    }

    /**
     * 評価登録
     */
    public function store(RatingRequest $request)
    {
        $loginId = $request['login_student_visitor']->id;
        $type = $request['login_student_visitor']->type;
        $req = $request->all();
        // 投票先のチームが存在しなければ
        $team = Team::find($req['team_id']);
        if(!$team) {
            return response(['status' => 'failure', 'message' => 'チームが存在しません'], 404);
        }
        $teamId = $req['team_id'];

        // 初期化
        $student_id = null;
        $visitor_id = null;

        // 学生または来場者で処理を分岐
        if ($type === 'student') {
            // 学生であれば自分のチームに投票することができない
            if($teamId === $request['login_student_visitor']->team_id) {
                return response(['status' => 'failure', 'message' => '自分のチームには投票することができません'], 400);
            }
            // 学生ならstudent_idで検索
            $rating = Rating::where('team_id', $teamId)
                            ->where('student_id', $loginId)
                            ->first();
            $student_id = $loginId;
        } else if ($type === 'visitor') {
            // 来場者ならvisitor_idで検索
            $rating = Rating::where('team_id', $teamId)
                            ->where('visitor_id', $loginId)
                            ->first();
            $visitor_id = $loginId;
        }

        // すでに登録されている場合
        if ($rating) {
            return response(['status' => 'failure', 'message' => 'すでに投票しています'], 400);
        }

        // データを保存
        $rating = Rating::create([
            'student_id' => $student_id,
            'visitor_id' => $visitor_id,
            'team_id' => $req['team_id'],
            'design' => $req['design'],
            'plan' => $req['plan'],
            'skill' => $req['skill'],
            'present' => $req['present'],
            'negative' => $req['negative'],
            'positive' => $req['positive'],
            'other' => $req['other']
        ]);

        return response(['status' => 'success', 'id' => $rating->id]);
    }

    /**
     * チーム別評価表示
     */
    public function teamIndex(int $id)
    {
        $team = Team::where('id', $id)->first();
        if (!$team) {
            return response(['status' => 'failure', 'message' => 'チームが存在しません'], 404);
        }

        $ratings = Rating::where('team_id', $id)->with(['Visitor'])->get();

        // 各ratingのデータを加工する
        $ratings->transform(function ($rating) {
            $rating->point = [
                "total" =>$rating->design + $rating->plan + $rating->skill + $rating->present,
                "plan" => $rating->plan,
                "design" => $rating->design,
                "skill" => $rating->skill,
                "present" => $rating->present,
            ];
            $rating->comment = [
                "positive" => $rating->positive,
                "negative" => $rating->negative,
                "other" => $rating->other,
            ];
            return $rating->makeHidden(['design', 'plan', 'skill', 'present', 'positive', 'negative', 'other']);
        });

        $res = [
            'status' => 'success',
            'rating' => $ratings
        ];

        return response($res, 200);
    }
}
