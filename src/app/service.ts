import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataDto } from "./data-dto";
@Injectable({
    providedIn: 'root'
})
export class ServiceHttp {
    constructor(
        private http: HttpClient
    ) { }

    updateToken(data: DataDto): Promise<any> {
        console.log(data);
        return this.http.post<any>(`https://localhost:44367/api/v2/SmsValidator/SaveMp3`, data).toPromise();
    }

}