import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@enviroment/environment';

export function createApollo(
  httpLink: HttpLink,
  cookieService: CookieService
): ApolloClientOptions<any> {
  const helper = new JwtHelperService();

  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8',
      Operation: operation.operationName
    }
  }));

  const auth = setContext((operation, context) => {
    const token = cookieService.get('token') || null;
    const isExpired = helper.isTokenExpired(token!);
    let data
    if (token === null || isExpired) {
      cookieService.delete('token')
      if (operation.operationName != 'login' && operation.operationName != "register") {
        data = {}
        throw new Error("TokenExpired")
      } else {
        data = {}
      }
    } /* else {
      return {
        headers: {
          Authorization: token,
        }
      };
    } */
    return data
  });
  const link = ApolloLink.from([basic, auth, httpLink.create({ uri: environment.apiUrl+'graphql'})]);
  const cache = new InMemoryCache();
  return {
    link,
    cache
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, CookieService],
    },
  ],
})
export class GraphQLModule { }
