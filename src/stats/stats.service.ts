import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entitie/comment.entity';
import { PostStatus } from 'src/entitie/postStatus.entity';
import { Repository } from 'typeorm';
import * as excel from 'exceljs';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(PostStatus)
    private readonly postStatusRepository: Repository<PostStatus>,
  ) {}

  async postVisited(postId: number) {
    const stats = await this.postStatusRepository.findOneBy({
      post: { id: postId },
    });
    stats.postViews++;
    await this.postStatusRepository.save(stats);
  }

  async updatePostStats(comment: Comment) {
    const stats = await this.postStatusRepository.findOne({
      where: { post: { id: comment.post.id } },
    });
    stats.avgRating *= stats.numberOfComments;
    stats.avgRating += comment.rate;
    stats.numberOfComments++;
    stats.avgRating /= stats.numberOfComments;
    comment.user ? stats.userComments++ : stats.guestComments++;

    await this.postStatusRepository.save(stats);
  }

  async getStatsCsv() {
    const stats = await this.postStatusRepository.find();
    const statsKeys = Object.keys(stats[0]);
    const arr = [];

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Post Stats');
    statsKeys.forEach((el) => {
      arr.push({ header: el, key: el, width: 25 });
    });
    worksheet.columns = arr;
    // worksheet.columns = [
    //   { header: 'Id', key: 'id' },
    //   { header: 'Views on post', key: 'postViews', width: 15 },
    //   { header: 'Total comments', key: 'numberOfComments', width: 15 },
    //   { header: 'Number of user comments', key: 'userComments', width: 25 },
    //   { header: 'Number of guest comments', key: 'guestComments', width: 25 },
    //   { header: 'Average ratings', key: 'avgRating', width: 15 },
    // ];

    worksheet.addRows(stats);
    return await workbook.xlsx.writeFile(__dirname + 'stats.xlsx');
  }

  async getPostStats(postId: number) {
    const { post, ...stats } = await this.postStatusRepository.findOne({
      where: { post: { id: postId } },
      relations: ['post'],
    });

    return { post, stats };
  }

  async uploadExcel(file: Express.Multer.File) {
    const arrOfPromises = [];
    const workbook = new excel.Workbook();
    const data = await workbook.xlsx.load(file.buffer);
    const worksheet = data.getWorksheet(1);
    const keys: any = worksheet.getRow(1).values;
    const obj = {};

    worksheet.eachRow((row, i) => {
      if (i > 1) {
        for (let i = 1; i < keys.length; i++) {
          obj[keys[i]] = row.values[i];
        }
        arrOfPromises.push(this.postStatusRepository.save(obj));
      }
    });
    Promise.all(arrOfPromises).then(() => {
      console.log('Database imported from excel');
    });
  }
}
