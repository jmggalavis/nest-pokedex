import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

   constructor(
 
     @InjectModel( Pokemon.name )
     private readonly pokemonModel: Model<Pokemon>,

     private readonly http: AxiosAdapter,
 
   ) {} 

  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    
    /********************************
     * Forma A de insertar varios registros simultáneamente
     */
    
    // // const insertPromisesArray = [];
    // const insertPromisesArray: Promise<Pokemon>[] = []; 


    // data.results.forEach(async ({ name, url }) => {

    //   const segments = url.split('/');
    //   const no = +segments[ segments.length - 2 ];

    //   //const pokemon = await this.pokemonModel.create( { name, no } );
    //   insertPromisesArray.push(
    //     this.pokemonModel.create( { name, no } )
    //   );

    //   await Promise.all( insertPromisesArray );
      /*****************************************
       * Fin forma A
       */

      /****************************************
       * Forma B
       */

    const pokemonToInsert: { name: string, no: number }[] = []; 


    data.results.forEach(async ({ name, url }) => {

      const segments = url.split('/');
      const no = +segments[ segments.length - 2 ];

      //const pokemon = await this.pokemonModel.create( { name, no } );
      pokemonToInsert.push( { name, no } );

      
      // console.log({ name, no });
      
    })

    await this.pokemonModel.insertMany(pokemonToInsert); 

    /***************************************
     * Fin forma B
     */
    
    return 'Seed executed';
  }

}
