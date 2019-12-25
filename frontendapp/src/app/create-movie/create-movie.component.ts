import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.css']
})
export class CreateMovieComponent implements OnInit {
  public movie: any;
  filesToUpload: Array<File>;
  constructor(private router: Router, private http: HttpClient, private location: Location) {
    this.filesToUpload = [];
    this.movie = {
      name: '',
      genre: '',
      formats: {
        digital: false,
        bluray: false,
        dvd: false
      }
    };
  }

  ngOnInit() {
  }

  upload() {
    this.makeFileRequest('http://localhost:3000/upload', [], this.filesToUpload).then((result) => {
        console.log(result);
    }, (error) => {
        console.error(error);
    });
}

fileChangeEvent(fileInput: any) {
    this.filesToUpload =  fileInput.target.files as Array<File> ;
}

makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
        const formData: any = new FormData();
        const xhr = new XMLHttpRequest();
        for (let i = 0; i < files.length; i++) {
            formData.append('uploads', files[i], files[i].name);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.response);
                }
            }
        };
        xhr.open('POST', url, true);
        xhr.send(formData);
    });
}
  public save() {
    if (this.movie.name && this.movie.genre) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      this.http.post('http://localhost:3000/movies', JSON.stringify(this.movie), httpOptions)
        .subscribe(result => {
          this.location.back();
        });
    }
  }
}
