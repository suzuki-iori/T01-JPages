<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\NumberAnswer;
use App\Models\TextAnswer;

class Question extends Model
{
    use HasFactory;
    /**
     * 追加フィールド
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'questionnaire_id',
        'order',
        'question',
        'isstring'
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
     * 数値回答と紐づけ
     */
    public function numberAnswers()
    {
        return $this->hasMany(NumberAnswer::class);
    }

    /**
     * 数値回答と紐づけ
     */
    public function textAnswers()
    {
        return $this->hasMany(TextAnswer::class);
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
