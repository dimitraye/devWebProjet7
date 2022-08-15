import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { Post } from '../models/Post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  posts$!: Observable<Post[]>;
  loading!: boolean;
  errorMsg!: string;

  constructor(private post: PostsService,
              private router: Router) { }

  ngOnInit() {
    this.loading = true;
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

}
