<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Team;
use App\Http\Requests\StudentRequest;

class StudentApiController extends Controller
{
    /**
     * 学生一覧取得
     */
    public function index()
    {
        $list = Student::with('team')->get()->makeHidden('token');
        foreach($list as $student) {
            $student->teamNum = $student->team->name ?  $student->team->name : $student->team->num;
        }
        $res = [
            'status' => 'success',
            'student' => $list->makeHidden('team')
        ];
        return response($res, 200);
    }

    /**
     * 学生登録
     */
    public function store(StudentRequest $request)
    {
        $req = $request->all();

        // チームの存在確認
        $team = Team::find($req['team_id']);
        if (!$team) {
            return response(['status' => 'failure', 'message' => 'チームが存在しません'], 404);
        }

        // 学籍番号の重複チェック
        $existingStudent = Student::where('number', $req['number'])->first();
        if ($existingStudent) {
            return response([
                'status' => 'failure',
                'message' => 'この学籍番号は既に使用されています'
            ], 422);
        }

        $student = Student::create($req);
        return response(['status' => 'success', 'id' => $student->id], 201);
    }

    /**
     * 学生詳細取得
     */
    public function show(int $id)
    {
        $student = Student::find($id);
        // もし存在しなければ
        if(! $student) {
            return response(['status' => 'failure', 'message' => '学生が存在しません'], 404);
        }
        $res = [
            'status' => 'success',
            'student' => $student->makeHidden('token')
        ];
        return response($res, 200);
    }


    /**
     * 学生編集
     */
    public function update(StudentRequest $request, int $id)
    {
        $student = Student::find($id);
        // 存在しなければ
        if(! $student) {
            return response(['status' => 'failure', 'message' => '学生が存在しません'], 404);
        }

        // 学生の場合、自分のアカウントしか変更不可
        if($request['login_admin_student']->type == 'student') {
            $studentId = $request['login_student_visitor']->id;
            if($id != $studentId) {
                return response(['status' => 'Unauthorized', 'message' => '編集権限がありません'], 401);
            }
        }

        $req = $request->all();
        // 重複チェック
        $existingStudent = Student::where('number', $req['number'])->where('id', '!=', $id)->first();
        if ($existingStudent) {
            return response([
                'status' => 'failure',
                'message' => 'この学籍番号は既に使用されています'
            ], 422);
        }
        $student->update($req);
        return response(['status' => 'success', 'id' => $student->id], 200);
    }

    /**
     * 学生消去
     */
    public function destroy(int $id)
    {
        $student = Student::find($id);
        if(! $student) {
            return response(['status' => 'failure', 'message' => '学生が存在しません'], 404);
        }
        $student->delete();
        return response(['status' => 'success', 'id' => $id], 200);

    }
}
