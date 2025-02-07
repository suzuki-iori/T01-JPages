import { useLocation } from 'react-router-dom';

const useSetUrlPath = () => {
    const location = useLocation();
    const myPath = location.pathname;
    // パスの先頭1文字を削除 
    const modPath = myPath.length > 1 ? myPath.slice(1) : myPath;
    
    // 学生詳細用の正規表現
    const studentRegExp = new RegExp("admin/student/([1-9]\\d*|0)");
    // チーム詳細用の正規表現
    const teamRegExp = new RegExp("admin/team/([1-9]\\d*|0)");
    const queDetailRegExp = new RegExp("admin/questionnairedetail/([1-9]\\d*|0)")

    const pathNames = {
        "admin/area": '会場',
        "admin/visitor": '来場者一覧',
        "admin/team": 'チーム一覧',
        "admin/reception": '受付',
        "admin/question": 'アンケート一覧',
        "admin/questionnairedetail":"アンケート一覧　＞　アンケート詳細",
        "admin/student": '学生一覧',
        "admin/": 'アナリティクス'
    };

    let translatedPath;

    // `student/<数字>` または `team/<数字>` を判定
    if (studentRegExp.test(modPath)) {
        translatedPath = '学生詳細';
    } else if (teamRegExp.test(modPath)) {
        translatedPath = 'チーム詳細';
    } else if (queDetailRegExp.test(modPath)){
        translatedPath = "アンケート一覧　＞　アンケート詳細"
    } else {
        translatedPath = pathNames[modPath] || modPath;
    }

    const finalPath = translatedPath ? ` > ${translatedPath}` : translatedPath;

    return finalPath;
};

export default useSetUrlPath;
