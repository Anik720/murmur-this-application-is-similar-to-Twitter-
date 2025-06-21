export class MurmurResponseDto {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
  };
  likeCount: number;
  createdAt: Date;
}