<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Character extends Model
{
    use HasFactory;
    /**
     * 追加フィールド
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'team_id',
        'level',
        'point',
        'type'
    ];

    /**
     * 隠すフィールド
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'team_id',
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
