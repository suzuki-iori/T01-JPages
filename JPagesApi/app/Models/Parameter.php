<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parameter extends Model
{
    use HasFactory;
    /**
     * 追加フィールド
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'team_id',
        'name',
        'score'
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
