<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Question;
use App\Models\Answer;

class TextAnswer extends Model
{
    use HasFactory;
    /**
     * 追加フィールド
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'question_id',
        'answer_id',
        'answer'
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
     * quesstion_idから質問を紐づける
     */
    public function question() {
        return $this->belongsTo(Question::class);
    }

    /**
     * answerと紐づけ
     */
    public function answerInfo() {
        return $this->belongsTo(Answer::class, 'answer_id');
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
