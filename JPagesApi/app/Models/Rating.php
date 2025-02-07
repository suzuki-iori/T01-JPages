<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Student;
use App\Models\Visitor;

class Rating extends Model
{
    use HasFactory;
    /**
     * 追加フィールド
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'team_id',
        'visitor_id',
        'student_id',
        'design',
        'plan',
        'skill',
        'present',
        'negative',
        'positive',
        'other'
    ];
    
    /**
     * 隠すフィールド
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'updated_at'
    ];

    /**
     * チームと学生を紐づける
     */
    // public function student()
    // {
    //     return $this->belongsTo(Student::class);
    // }

    /**
     * チームとキャラクターを紐づける
     */
    public function Visitor()
    {
        return $this->belongsTo(Visitor::class);
    }

    /**
     * created_atのフォーマット
     */
    public function getCreatedAtAttribute($value)
    {
        return date('Y-m-d H:i:s', strtotime($value)); 
    }

    /**
     * updated_atのフォーマット
     */
    public function getUpdatedAtAttribute($value)
    {
        return date('Y-m-d H:i:s', strtotime($value)); 
    }
}
