<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Answer;
class AnswerApiController extends Controller
{
    /**
     * 回答一覧
     */
    public function index()
    {
        $list = Answer::with(['visitor'])->get();
        $res = [
            'status' => 'success',
            'answera' => $list
        ];
        return response($res, 200);
    }

    /**
     * 回答登録
     */
    public function store(Request $request)
    {
        $visitorId = $request['login_visitor']->id;
        $answer = Answer::where('visitor_id', $visitorId)->first();
        if($answer) {
            return response(['status' => 'failure', 'message' => 'すでに投稿されています'], 400);
        }
        $answer = Answer::create(['visitor_id' => $visitorId]);
        return response(['status' => 'success', 'id' => $answer->id]);
    }

    /**
     * 回答詳細 アンケートのidを取得し、一覧で表示する
     */
    public function show(int $id)
    {
       // 指定したIDのAnswerを取得
        $answer = Answer::with(['numberAnswers.question', 'textAnswers.question', 'visitor'])->find($id);

        // Answerが見つからなかった場合の処理
        if (!$answer) {
            return response(['status' => 'failure', 'message' => '回答が存在しません'], 404);
        }


        $answers = [];

        // numberAnswers
        foreach ($answer->numberAnswers as $item) {
            $answers[] = [
                'id' => $item->id,
                'answer' => $item->answer,
                'order' => $item->question->order,
                'question_text' => $item->question->question,
                'created_at' => $item->created_at,
            ];
        }

        // textAnswers
        foreach ($answer->textAnswers as $item) {
            $answers[] = [
                'id' => $item->id,
                'answer' => $item->answer,
                'order' => $item->question->order,
                'question_text' => $item->question->question,
                'created_at' => $item->created_at,
            ];
        }

        // orderでソート
        usort($answers, function ($a, $b) {
            return $a['order'] <=> $b['order'];
        });
        return response([
            'status' => 'success',
            'visitor' => $answer->visitor,
            'answers' => $answers,
        ]);

    }
}
