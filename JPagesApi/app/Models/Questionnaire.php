<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Question;

class Questionnaire extends Model
{
    use HasFactory;
    /**
     * 追加フィールド
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title'
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
     * アンケートに紐づいた質問を取得する
     */
    public function questions()
    {
        return $this->hasMany(Question::class);
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
