class InterceptorsService {

    constructor() {
        this.token = null;
    }

    setToken(newToken) {
        this.token = newToken; 
    }


    createInterceptors() {
        axios.interceptors.request.use(request => {
            if (this.token) {
                request.headers.authorization = "Bearer " + this.token;
            }
            return request;
        });
    }

}

const interceptorsService = new InterceptorsService();
interceptorsService.createInterceptors();

window.interceptorsService = interceptorsService;
