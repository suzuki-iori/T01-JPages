<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Ratings;

class Visitor extends Model
{
    use HasFactory;

    /**
     * 追加フィールド
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'affiliation',
        'name',
        'email',
        'division',
        'token'
    ];

    /**
     * 隠すフィールド
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'token',
        'updated_at'
    ];

    /**
     * 投稿した評価
     */
    public function ratings()
    {
        return $this->hasMany(Rating::class);
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
