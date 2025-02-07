<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NumberAnswer;
use App\Models\Question;
use App\Models\Answer;
use App\Http\Requests\NumberAnswerRequest;

class NumberAnswerApiController extends Controller
{
    /**
     * アンケート投稿
     */
    public function store(NumberAnswerRequest $request)
    {
        $req = $request->all();
        $question = Question::find($req['question_id']);
        $answer = Answer::find($req['answer_id']);
        if(!$question || !$answer) {
            return response(['status' => 'failure', 'message' => '対応する質問または回答が存在しません'], 404);
        }
        $answer = NumberAnswer::create($req);
        return response(['status' => 'success', 'id' => $answer->id], 201);
    }
}
