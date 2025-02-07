<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\NumberAnswer;
use App\Models\TextAnswer;
use App\Models\Visitor;
use App\Models\Question;

class Answer extends Model
{
    use HasFactory;

    /**
     * 追加フィールド
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'visitor_id'
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
     * 数値回答と紐づけて
     */
    public function numberAnswers()
    {
        return $this->hasMany(NumberAnswer::class);
    }

    /**
     * 数値回答と紐づけて
     */
    public function textAnswers()
    {
        return $this->hasMany(TextAnswer::class);
    }

    /**
     * 来場者と紐づけ
     */
    public function visitor()
    {
        return $this->belongsTo(Visitor::class);
    }

    /**
     * 質問と紐づけ
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
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
