<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
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
            $student->teamNum = $student->team
                ? ($student->team->name ?: $student->team->num)
                : null;
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
        if(!empty($req['team_id'])) {
            $team = Team::find($req['team_id']);
            if (!$team) {
                return response(['status' => 'failure', 'message' => 'チームが存在しません'], 404);
            }
        }

        // 学籍番号の重複チェック（同年度のみ重複不可）
        $now = Carbon::now();
        $fy = $now->month >= 4 ? $now->year + 1 : $now->year;
        $fyStart = Carbon::create($fy - 1, 4, 1)->startOfDay();
        $fyEnd = Carbon::create($fy, 3, 31)->endOfDay();
        $existingStudent = Student::where('number', $req['number'])
            ->whereBetween('created_at', [$fyStart, $fyEnd])
            ->first();
        if ($existingStudent) {
            return response([
                'status' => 'failure',
                'message' => 'この年度では同じ学籍番号が既に使用されています'
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

        // チームの存在確認（team_idが指定された場合のみ）
        if(!empty($req['team_id'])) {
            $team = Team::find($req['team_id']);
            if (!$team) {
                return response(['status' => 'failure', 'message' => 'チームが存在しません'], 404);
            }
        }

        // 重複チェック（同年度のみ重複不可）
        $created = Carbon::parse($student->created_at);
        $fy = $created->month >= 4 ? $created->year + 1 : $created->year;
        $fyStart = Carbon::create($fy - 1, 4, 1)->startOfDay();
        $fyEnd = Carbon::create($fy, 3, 31)->endOfDay();
        $existingStudent = Student::where('number', $req['number'])
            ->where('id', '!=', $id)
            ->whereBetween('created_at', [$fyStart, $fyEnd])
            ->first();
        if ($existingStudent) {
            return response([
                'status' => 'failure',
                'message' => 'この年度では同じ学籍番号が既に使用されています'
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
