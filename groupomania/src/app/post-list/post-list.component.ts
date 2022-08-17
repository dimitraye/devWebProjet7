import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { Post } from '../models/Post.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  posts$!: Observable<Post[]>;
  loading!: boolean;
  errorMsg!: string;
  userId!: string;
  isAdmin!: boolean;
  constructor(private post: PostsService,
              private router: Router,
              private auth: AuthService
              ) { }

  ngOnInit() {
    this.loading = true;
    this.userId = this.auth.getUserId();
    this.isAdmin = this.auth.getLocalUserRole() == 'admin';

    this.posts$ = this.post.posts$.pipe(
      tap(() => {
        this.loading = false;
        this.errorMsg = '';
      }),
      catchError(error => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
        return of([]);
      })
    );
    this.post.getPosts();
  }

  onClickPost(id: string) {
    this.router.navigate(['post', id]);
  }

  onModify(id: any) {
    this.router.navigate(['/modify-post', id]);
  }
  
  onDelete(id: any) {
    this.loading = true;
    this.post.deletePost(id)
    .subscribe(
      response => {
        console.log(response);
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error);
      });
      this.router.navigate(['/posts']);

  }
}


