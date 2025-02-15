<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Visitor;

class DeviationController extends Controller
{
    public function deviation() {
        $student = Student::with(['ratings'])->get();
        $visitor = Visitor::with(['ratings'])->get();
        
    }
}
