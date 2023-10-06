import path from "path";
import fs from "fs";
import Controller from './Controller.js';

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
    }
    get(id) {
        let params = this.HttpContext.path.params;
        let errorMessage = "";
        switch (this.HttpContext.path.params.op) {
            case ' ':
            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
                if (Object.keys(params).length != 3)
                    errorMessage = `nombres de paramètres incorrect ${Object.keys(params).length} donnés ,3 nécessaires`;
                if (params.x == null)
                    errorMessage = "paramètre x non défini";
                if (isNaN(parseInt(params.x)))
                    errorMessage = `x (${params.x}) n'est pas un nombre`;
                if (params.y == null)
                    errorMessage = "paramètre y non défini";
                if (isNaN(parseInt(params.y)))
                    errorMessage = `y (${params.y}) n'est pas un nombre`;
                break;
            case '!':
            case 'p':
            case 'np':
                if (Object.keys(params).length != 2)
                    errorMessage = `nombres de paramètres incorrect ${Object.keys(params).length} donnés ,2 nécessaires`;
                if (params.n == null)
                    errorMessage = "paramètre n non défini";
                if (isNaN(parseInt(params.n)))
                    errorMessage = `n (${params.n}) n'est pas un nombre`;
                if (/[\.]/.test(String(params.n))) // is float
                    errorMessage = `n (${params.n}) n'est pas un nombre entier`;
                if (parseInt(params.n) <= 0)
                    errorMessage = `n (${params.n}) n'est pas un nombre positif`;
                break;;
        }
        if (errorMessage != "") {
            //this.HttpContext.response.unprocessable(`error: ${params.n}`);
            this.HttpContext.response.JSON({ ...params, "error":  errorMessage});
        }
        else
        {
            switch (this.HttpContext.path.params.op) {
                case " ":
                case "+":
                    this.HttpContext.response.JSON({ ...params, "op": "+", "value": parseFloat(params.x) + parseFloat(params.y) });
                    break;
                case "-":
                    this.HttpContext.response.JSON({ ...params, "value": parseFloat(params.x) - parseFloat(params.y) });
                    break;
                case "*":
                    this.HttpContext.response.JSON({ ...params, "value": parseFloat(params.x) * parseFloat(params.y) });
                    break;
                case "/":
                    if (parseFloat(params.y) == 0) {
                        if(parseFloat(params.x) == 0)
                        {
                            this.HttpContext.response.JSON({ ...params, "value":'NaN' });
                        }
                        else
                        {
                            this.HttpContext.response.JSON({ ...params, "value":'Infinity' });
                        }

                    }
                    else{
                        this.HttpContext.response.JSON({ ...params, "value": parseFloat(params.x) / parseFloat(params.y) });
                    }
                    break;
                case "%":
                    if(parseInt(params.y) == 0)
                    {
                        this.HttpContext.response.JSON({ ...params, "value": "NaN" });
                    }
                    else
                        this.HttpContext.response.JSON({ ...params, "value": parseInt(params.x) % parseInt(params.y) });
                    break;
                case "!":
                    this.HttpContext.response.JSON({ ...params, "value": factorial(parseInt(params.n)) });
                    break;
                case "p":
                    this.HttpContext.response.JSON({ ...params, "value": isPrime(parseInt(params.n)) });
                    break;
                case "np":
                    this.HttpContext.response.JSON({ ...params, "value": findPrime(parseInt(params.n)) });
                    break;
                default:
                    if(params.op == null)
                    {
                        let helpPagePath= path.join(process.cwd(),wwwroot,'API_Help_PAGE/API-Math-help.html');
                        this.HttpContext.response.HTML(fs.readFileSync(helpPagePath));
                    }
                    else
                    {
                        this.HttpContext.response.notFound(`L'opérateur ${params.op} n'a pas été trouvé`);
                    }

                    break;
            }
        }
        function factorial(n) {
            if (n === 0 || n === 1) {
                return 1;
            }
            return n * factorial(n - 1);
        }

        function isPrime(value) {
            for (var i = 2; i < value; i++) {
                if (value % i === 0) {
                    return false;
                }
            }
            return value > 1;
        }

        function findPrime(n) {
            let primeNumer = 0;
            for (let i = 0; i < n; i++) {
                primeNumer++;
                while (!isPrime(primeNumer)) {
                    primeNumer++;
                }
            }
            return primeNumer;
        }
    }
}
