<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
class CorporationController extends Controller
{
    public function getCorporationNumber(Request $request)
    {
        // リクエストバリデーション
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // 入力された法人名
        $name = $request->input('name');

        // APIエンドポイントとパラメータ
        $url = 'https://api.houjin-bangou.nta.go.jp/4/name';
        $params = [
            'id' => 'KJvk37FdYdZam', // .envファイルでAPIキーを管理
            'name' => $name,
            'change' => '1',         // 変更情報を含む
            'type' => '02',          // JSON形式
        ];

        // 法人番号APIへのリクエスト
        $response = Http::get($url, $params);

        // レスポンスの処理
        if ($response->successful()) {
            $data = $response->json();

            // 必要なデータを抽出
            if (isset($data['corporations']) && count($data['corporations']) > 0) {
                $corporation = $data['corporations'][0]; // 最初の法人データを取得
                return response()->json([
                    'corporation_number' => $corporation['corporateNumber'], // 法人番号
                    'name' => $corporation['name'],                         // 法人名
                    'address' => $corporation['address'],                   // 所在地
                ]);
            } else {
                return response()->json([
                    'message' => '該当する法人が見つかりません。',
                ], 404);
            }
        } else {
            return response()->json([
                'message' => '法人番号APIのリクエストが失敗しました。',
                'error' => $response->body(),
            ], $response->status());
        }
    }
}
