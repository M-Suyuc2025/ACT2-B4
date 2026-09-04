import { Injectable } from "@angular/core";
import { Observable, of} from "rxjs";
import { delay } from "rxjs/operators";
import { Productos } from "../models/productos.model";

@Injectable({
    providedIn: "root"
})
export class ProductosService{
    guardarProducto(producto: Productos): Observable<{success: boolean; data : Productos}>{
        console.log("Enviando Datos", producto);
        return of({success: true, data: producto}).pipe(
            delay(1000)
        );
    }
}