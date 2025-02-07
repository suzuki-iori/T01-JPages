<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TextAnswer;
use App\Models\Question;
use App\Models\Answer;
use App\Http\Requests\TextAnswerRequest;

class TextAnswerApiController extends Controller
{
    /**
     * アンケート投稿
     */
    public function store(TextAnswerRequest $request)
    {
        $req = $request->all();
        $question = Question::find($req['question_id']);
        $answer = Answer::find($req['answer_id']);
        if(!$question || !$answer) {
            return response(['status' => 'failure', 'message' => '対応する質問または回答が存在しません。'], 404);
        }
        $answer = TextAnswer::create($req);
        return response(['status' => 'success', 'id' => $answer->id]);
    }
}
