import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductosService } from '../services/productos.service';
import { Productos } from '../models/productos.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './productos-form.css',
  templateUrl: './productos-form.html',
})
export class ProductosComponent implements OnInit {
  productoForm!: FormGroup;
  categorias: string[] = ["Ropa", "Hogar", "Juguetes"];
  isSubmitting: boolean = false;
  
  listaProductos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductosService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      catagoria: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      descripcion: ['', [Validators.maxLength(200)]]
    });
  }

  campoInvalido(fieldName: string): boolean {
    const control = this.productoForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getControlErrors(fieldName: string): string[] {
    const control = this.productoForm.get(fieldName);
    if (!control || !control.errors) return [];

    const errors: string[] = [];
    if (control.errors['required']) errors.push("Este campo es obligatorio.");
    if (control.errors['minlength']) {
      errors.push(`Mínimo ${control.errors['minlength'].requiredLength} caracteres.`);
    }
    if (control.errors['maxlength']) {
      errors.push(`Máximo ${control.errors['maxlength'].requiredLength} caracteres.`);
    }
    if (control.errors['min']) {
      errors.push(`El valor mínimo permitido es ${control.errors['min'].min}.`);
    }

    return errors;
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const productoData: Productos = this.productoForm.value;

    this.productoService.guardarProducto(productoData).subscribe({
      next: (response: { success: boolean; data: Productos }) => {
        this.isSubmitting = false;
        
        const nuevoProducto = response?.data || productoData;
        
        this.listaProductos.unshift(nuevoProducto);
        
        this.productoForm.reset();
      },
      error: (err: HttpErrorResponse | any) => {
        this.isSubmitting = false;
        console.error("Error al guardar el Producto", err);
      }
    });
  }
}