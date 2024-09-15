import { CartService, UserService } from '@/application/services'

interface GetAuthenticatedUserUseCaseParams {
  id: string
}

export class GetAuthenticatedUserUseCase {
  constructor(
    private cartService: CartService,
    private userService: UserService,
  ) {}

  async execute(params: GetAuthenticatedUserUseCaseParams) {
    const { id } = params

    const user = await this.userService.findUserById(id)
    const cart = await this.cartService.findCartByUserId(user.id)

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      cart: {
        id: cart.id,
        items: cart.items.map((item) => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
          },
          quantity: item.quantity,
        })),
      },
    }
  }
}
