<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use \Illuminate\Contracts\Validation\Validator;
use \Illuminate\Validation\ValidationException;

class RatingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'team_id' => 'required|int|min:1',
            'design' => 'required|int|min:0|max:100',
            'plan' => 'required|int|min:0|max:100',
            'skill' => 'required|int|min:0|max:100',
            'present' => 'required|int|min:0|max:100',
            'negative' => 'max:255',
            'positive' => 'max:255',
	    'other' => 'max:255'
        ];
    }
    
    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function failedValidation(Validator $validator)
    {
        $exception = $validator->getException();

        throw (new $exception($validator, 
                response(["status" => "ParameterError", "message" => "パラメーターエラー"], 400)
            ));
    }
}
