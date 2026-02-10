<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TeamApiController;
use App\Http\Controllers\VisitorApiController;
use App\Http\Controllers\CharacterApiController;
use App\Http\Controllers\RatingApiController;
use App\Http\Controllers\StudentApiController;
use App\Http\Controllers\QuestionnaireApiController;
use App\Http\Controllers\QuestionApiController;
use App\Http\Controllers\AnswerApiController;
use App\Http\Controllers\TextAnswerApiController;
use App\Http\Controllers\NumberAnswerApiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ParameterApiController;


use App\Http\Middleware\VisitorTokenAuth;
use App\Http\Middleware\AdminTokenAuth;
use App\Http\Middleware\StudentTokenAuth;
use App\Http\Middleware\AdminStudentTokenAuth;
use App\Http\Middleware\VisitorStudentTokenAuth;

/**
 * 管理者認証あり
 */
Route::middleware([AdminTokenAuth::class])->group(function() {
  // 管理者ログアウト
  Route::post('/logout', [AuthController::class, 'logout']);
  // チーム一覧
  Route::get('/team', [TeamApiController::class, 'index']);
  // 来場者一覧
  Route::get('/visitor', [VisitorApiController::class, 'index']);
  // 来場者詳細
  Route::get('/visitor/{id}', [VisitorApiController::class, 'show']);
  // 来場者消去
  Route::delete('/visitor/{id}', [VisitorApiController::class, 'destroy']);
  // チーム登録
  Route::post('/team', [TeamApiController::class, 'store']);
  // チーム削除
  Route::delete('/team/{id}', [TeamApiController::class, 'destroy']);
  // 評価一覧
  Route::get('/rating', [RatingApiController::class, 'index']);
  // 学生一覧
  Route::get('/student', [StudentApiController::class, 'index']);
  // 学生登録
  Route::post('/student', [StudentApiController::class, 'store']);
  // 学生削除
  Route::delete('/student/{id}', [StudentApiController::class, 'destroy']);
  // 学生詳細
  Route::get('/student/{id}', [StudentApiController::class, 'show']);
  // アンケート一覧表示
  Route::get('/questionnaire', [QuestionnaireApiController::class, 'index']);
  // アンケート作成
  Route::post('/questionnaire', [QuestionnaireApiController::class, 'store']);
  // アンケート編集
  Route::put('/questionnaire/{id}', [QuestionnaireApiController::class, 'update']);
  // アンケート消去
  Route::delete('/questionnaire/{id}', [QuestionnaireApiController::class, 'destroy']);
  // 質問一覧
  Route::get('/survey', [QuestionApiController::class, 'index']);
  // 質問追加
  Route::post('/survey', [QuestionApiController::class, 'store']);
  // 質問編集
  Route::put('/survey/{id}', [QuestionApiController::class, 'update']);
  // 質問消去
  Route::delete('/survey/{id}', [QuestionApiController::class, 'destroy']);
  // 回答一覧
  Route::get('/survey/answer', [AnswerApiController::class, 'index']);
  // 回答詳細
  Route::get('/survey/answer/{id}', [AnswerApiController::class, 'show']);
  // パラメーター一覧
  Route::get('/parameter', [ParameterApiController::class, 'index']);

});


/**
 *　学生認証あり
 */
Route::middleware([StudentTokenAuth::class])->group(function() {
  // キャラクター成長
  Route::put('character/{id}', [CharacterApiController::class, 'update']);
});

/**
 * 学生認証または管理者認証あり
 */
Route::middleware([AdminStudentTokenAuth::class])->group(function() {
  // チーム編集
  Route::put('/team/{id}', [TeamApiController::class, 'update']);
  // 学生編集
  Route::put('/student/{id}', [StudentApiController::class, 'update']);
  // パラメーター編集
  Route::put('/parameter/{id}', [ParameterApiController::class, 'update']);
});

/**
 * 無認証来場者向け
 */

//チーム詳細取得
Route::get('/team/{id}', [TeamApiController::class, 'show']);
//チームトップ情報取得
Route::get('/team/top/{id}', [TeamApiController::class, 'showTop']);
// 来場者登録
Route::post('/visitor', [VisitorApiController::class, 'store']);
// キャラクター一覧
Route::get('/character', [CharacterApiController::class, 'index']);
// キャラクター詳細
Route::get('/character/{id}', [CharacterApiController::class, 'show']);
// チーム別評価
Route::get('/rating/{id}', [RatingApiController::class, 'teamIndex']);
// アクティブなアンケート取得
Route::get('/questionnaire/active', [QuestionnaireApiController::class, 'getActive']);
// アンケート詳細
Route::get('/questionnaire/{id}', [QuestionnaireApiController::class, 'show']);
// チームパラメーター
Route::get('/parameter/{id}', [ParameterApiController::class, 'listParameters']);
// ランキング
Route::get('/ranking', [TeamApiController::class, 'getRanking']);


// チーム一覧
Route::get('showTeam/app', [TeamApiController::class, 'app']);





/**
 * 認証あり来場者向け
 */
Route::middleware([VisitorTokenAuth::class])->group(function() {
  // 来場者編集
  Route::put('/visitor', [VisitorApiController::class, 'update']);
  // 回答追加
  Route::post('/survey/answer', [AnswerApiController::class, 'store']);
  // テキスト回答追加
  Route::post('/survey/answer/text', [TextAnswerApiController::class, 'store']);
  // ナンバー回答追加
  Route::post('/survey/answer/number', [NumberAnswerApiController::class, 'store']);
});

/**
 * 来場者または学生向け認証
 */
Route::middleware([VisitorStudentTokenAuth::class])->group(function() {
  // 評価登録
  Route::post('/rating', [RatingApiController::class, 'store']);
});


// 管理者ログイン
Route::post('/login', [AuthController::class, 'login']);
//学生ログイン
Route::post('/studentlogin', [AuthController::class, 'studentAuth']);