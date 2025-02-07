async function CorporationAjax(num = "") {

    const response = await fetch( `https://api.houjin-bangou.nta.go.jp/3/num?id=KJvk37FdYdZam&number=${num}&type=12&history=0`);
    return response.json();
}

export default CorporationAjax;
