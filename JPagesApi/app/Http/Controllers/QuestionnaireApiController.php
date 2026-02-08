<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Questionnaire;
use App\Http\Requests\QuestionnaireRequest;

class QuestionnaireApiController extends Controller
{
    /**
     * アンケート一覧表示
     */
    public function index()
    {
        $list = Questionnaire::get();
        $res = [
            'status' => 'success',
            'questionnaire' => $list
        ];
        return response($res, 200);
    }

    /**
     * アンケート作成
     */
    public function store(QuestionnaireRequest $request)
    {
        $req = $request->all();
        $questionnaire = Questionnaire::create($req);
        return response(['status' => 'success', 'title' => $questionnaire->title]);
    }

    /**
     * アンケート詳細表示
     */
    public function show(int $id)
    {
        $questionnaire = Questionnaire::find($id);
        if(! $questionnaire) {
            return response(['status' => 'failure', 'message' => 'アンケートが存在しません'], 404);
        }
        $questionnaire = $questionnaire->questions()
            ->with(['numberAnswers.answerInfo.visitor', 'textAnswers.answerInfo.visitor'])
            ->orderBy('order', 'asc')->get();

        $res = [
            'status' => 'success',
            'questionnaire' => $questionnaire
        ];
        return response($res, 200);
    }

    /**
     * アンケート編集
     */
    public function update(QuestionnaireRequest $request, int $id)
    {
        $questionnaire = Questionnaire::find($id);
        if(! $questionnaire) {
            return response(['status' => 'failure', 'message' => 'アンケートが存在しません'], 404);
        }
        $req = $request->all();
        $questionnaire->update($req);
        return response(['status' => 'success', 'id' => $questionnaire->id], 200);
    }

    /**
     * アンケート消去
     */
    public function destroy(int $id)
    {
        $questionnaire = Questionnaire::find($id);
        if(! $questionnaire) {
            return response(['status' => 'failure', 'message' => 'アンケートが存在しません'], 404);
        }
        $questionnaire->delete();
        return response(['status' => 'success', 'id' => $id], 200);
    }
}
