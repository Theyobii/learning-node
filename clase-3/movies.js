import zod from 'zod';
const z = zod;

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Title is required',
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10),
    poster: z.string().url({
        message: 'Poster must be a valid URL',
    }),
    genre: z.array(
        z.enum(['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Documentary']), {
        invalid_type_error: 'Genre must be an array of strings',
    }
    )
})

export const validateMovie = (object) => {
    return movieSchema.safeParse(object)
}


export const validatePartialMovie = (object) => {
    return movieSchema.partial().safeParse(object)
}

