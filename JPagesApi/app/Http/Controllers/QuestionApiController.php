<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;
use App\Models\Questionnaire;
use App\Http\Requests\QuestionRequest;
class QuestionApiController extends Controller
{
    /**
     * 質問一覧表示
     */
    public function index()
    {
        $list = Question::get();
        $res = [
            'status' => 'success',
            'question' => $list
        ];
        return response($res, 200);
    }

    /**
     * 質問追加
     */
    public function store(QuestionRequest $request)
    {
        $req = $request->all();
        // アンケートの存在確認
        $questionnaire = Questionnaire::find($req['questionnaire_id']);
        if(!$questionnaire) {
            return response(['stauts' => 'failure', 'message' => 'アンケートが存在しません'], 404);
        }
        $question = Question::create($req);
        return response(['status' => 'success', 'title' => $question->question]);
    }

    /**
     * 質問編集
     */
    public function update(Request $request, int $id)
    {
        $question = Question::find($id);
        if(! $question) {
            return response(['status' => 'failure', 'message' => '質問が存在しません'], 404);
        }
        $req = $request->all();
        // アンケートの存在確認
        $questionnaire = Questionnaire::find($req['questionnaire_id']);
        if(!$questionnaire) {
            return response(['stauts' => 'failure', 'message' => 'アンケートが存在しません'], 404);
        }
        $question->update($req);
        return response(['status' => 'success', 'id' => $question->id], 200);
    }

    /**
     * 質問消去
     */
    public function destroy(int $id)
    {
        $question = Question::with(['numberAnswers', 'textAnswers'])->find($id);
        if(! $question) {
            return response(['status' => 'failure', 'message' => '質問が存在しません'], 404);
        }
        if($question->numberAnswers->isEmpty() || $question->textAnswers->isEmpty()) {
            return response(['status' => 'failure', 'message' => 'すでに回答がある質問です'], 400);
        }
        dd($question);
        
        $question->delete();
        return response(['status' => 'success', 'id' => $id], 200);
    }
}
