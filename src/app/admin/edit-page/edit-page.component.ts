import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { PostsService } from '../shared/posts.service';
import { Post } from '../shared/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup
post: Post
submitted = false

uSub: Subscription

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {
  }
  ngOnDestroy(): void {
    if(this.uSub) {
      this.uSub.unsubscribe()
    }
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postsService.getById(params['id'])
      })
    ).subscribe((post: Post) => {
      this.post = post
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required)
      })
    })
  }

  submit() {
    if(this.form.invalid) {
      return
    }

    this.submitted = true

    this.uSub =  this.postsService.update({
      ...this.post,
      id:this.post.id,
      text: this.form.value.text,
      title: this.form.value.title,
      author: this.form.value.author,
    }).subscribe(()=>{
      this.submitted = false
    })
  }
}
