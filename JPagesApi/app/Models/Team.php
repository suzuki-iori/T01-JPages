<?php

namespace App\Models;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Character;
use App\Models\Parameter;
use App\Models\Rating;

class Team extends Model
{
    use HasFactory;
    /**
     * 追加フィールド
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'num',
        'name',
        'detail',
        'ispresent',
        'grade'
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
    public function students()
    {
        return $this->hasMany(Student::class);
    }

    /**
     * チームとキャラクターを紐づける
     */
    public function character()
    {
        return $this->hasOne(Character::class);
    }

    /**
     * チームとパラメーターを紐づける
     */
    public function parameters()
    {
        return $this->hasMany(Parameter::class);
    }

    /**
     * チームとパラメーターを紐づける
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
