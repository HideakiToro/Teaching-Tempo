export default async function checkAuth() {
    const allCookies = document.cookie;

    // Parse cookies into an object
    let cookies = Object.fromEntries(allCookies.split('; ').map(c => {
      const [key, ...v] = c.split('=');
      return [key, v.join('=')];
    }));

    if(cookies["Session"]){
        let res = await $fetch("/api/user/check",{
            method: 'POST',
            body: {
                session: cookies["Session"]
            }
        });
        return res.ok;
    }else{
        return false;
    }
}