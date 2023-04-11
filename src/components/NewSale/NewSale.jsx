import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../../services/firebase';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { UpdateProductsContext } from '../../contexts/UpdateProductsProvider';
import { Header } from '../Header/Header';
import { ArrowCircleLeft, Coins, Export, FloppyDisk, HandCoins, MinusCircle, PlusCircle, Trash } from '@phosphor-icons/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastifyContext } from '../../contexts/ToastifyProvider';
import { StockSumContext } from '../../contexts/StockSumProvider';
import { SalesContext } from '../../contexts/SalesProvider';

import '../../App.scss';
import CurrencyInput from 'react-currency-input-field';

export const NewSale = () => {
  const date = new Date();
  const navigate = useNavigate();
  const { setUpdateProductId, updateProductId, saleRaw, firestoreLoading, refreshHandler } = useContext(UpdateProductsContext);
  const salesCollectionRef = collection(db, 'vendas');
  const stockCollectionRef = collection(db, 'stock');
  const { notifySuccess, notifyError } = useContext(ToastifyContext); // Toastify Context
  
  const {
    newSaleBlock, setNewSaleBlock,
    newSaleApartment, setNewSaleApartment,
    newSalePayment, setNewSalePayment,
    newSaleStatus, setNewSaleStatus,
    newSaleCartQuantity, setNewSaleCartQuantity,
    newSaleCartProduct, setNewSaleCartProduct,
    newSaleDiscount, setNewSaleDiscount,
    newSaleObs, setNewSaleObs,
    newSaleChange, setNewSaleChange,
    stockRaw,
    price,
    type,
    cart,

    registerSale,
    updateSale,
    handleDeleteSale,
    handleNewCartProduct,
    handleDeleteCartProduct
  } = useContext(SalesContext);

  // Yup Resolver
  const saleSchema = yup.object({
    apartment: yup.string().required("Insira o número do apartamento").min(3, "Número inválido"),
    block: yup.string().required("Insira o número do bloco"),
    payment: yup.string().required("Insira o método de pagamento"),
  }).required()

  // Hook Form Controller
  const {
    watch,
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors, isValid }
  } = useForm({
    mode: "all",
    resolver: yupResolver(saleSchema),
    defaultValues: {
      payment: "",
      status: "Novo Pedido",
      discount: 0
    }
  });

  // Handling Discount Show
  const [discountShow, setDiscountShow] = useState(false);

  // Is plus button disabled
  const [isPlusButtonDisabled, setIsPlusButtonDisabled] = useState(true);
  useEffect(() => {
    watch("cart-product") === "" || watch("cart-quantity") < 1 ?
    setIsPlusButtonDisabled(true) :
    setIsPlusButtonDisabled(false);
  }, [watch("cart-product"), watch("cart-quantity")]);

  // Sending input data to sales context
  useEffect(() => {
    setNewSaleBlock(watch("block"))
    setNewSaleApartment(watch("apartment"))
    setNewSalePayment(watch("payment"))
    setNewSaleStatus(watch("status"))
    setNewSaleCartQuantity(watch("cart-quantity"))
    setNewSaleCartProduct(watch("cart-product"))
    setNewSaleDiscount(watch("discount"))
    setNewSaleObs(watch("obs"))
  }, [
    watch("block"),
    watch("apartment"), 
    watch("payment"), 
    watch("status"), 
    watch("cart-quantity"), 
    watch("cart-product"), 
    watch("discount"),
    watch("obs"),
  ])

  // Updating input fields when updating sale
  useEffect(() => {
    setValue("block", newSaleBlock)
    setValue("apartment", newSaleApartment)
    setValue("payment", newSalePayment)
    setValue("status", newSaleStatus)
    setValue("cart-quantity", newSaleCartQuantity)
    setValue("cart-product", newSaleCartProduct)
    setValue("discount", newSaleDiscount)
    // newSaleDiscount === '' ? setValue("discount", 0) : setValue("discount", newSaleDiscount)
    setValue("obs", newSaleObs)
  }, [
    newSaleBlock,
    newSaleApartment,
    newSalePayment,
    newSaleStatus,
    newSaleCartQuantity,
    newSaleCartProduct,
    newSaleDiscount,
    newSaleObs,
  ])

  // Clear change when not money payment
  useEffect(() => {
    newSalePayment !== "Dinheiro" &&
    setNewSaleChange(0);
  }, [newSalePayment])

  // Validating buttons
  const [isButtonsValid, setIsButtonsValid] = useState(false);
  useEffect(() => {
    if(!isValid || isNaN(newSaleChange) === true) {
      console.log("not valid");
      setIsButtonsValid(false);
    } else {
      console.log("valid");
      setIsButtonsValid(true);
    }
  }, [isValid, newSalePayment, newSaleChange])

  console.log(newSaleChange)

  return (
    <>
      <Header />
      <div className="new-sale-container">
        <div className="main-info">
          <div className="back-button-wrapper">
            <ArrowCircleLeft 
              size={34} 
              weight="duotone" 
              id="go-back-button" 
              onClick={() => navigate("/sales-table")}
            />
          </div>
          <div className="input-row">
            <label htmlFor="block">Bloco</label>
            <input type="text" id="block" {...register("block")} />
            <span id="error-alert-message">{errors?.block?.message}</span>
          </div>
          <div className={`input-row ${errors.apartment}`}>
            <label htmlFor="block">Apartamento</label>
            <input type="text" {...register("apartment")} />
            <span id="error-alert-message">{errors?.apartment?.message}</span>
          </div>
          <div className="input-row">
            <label htmlFor="block">Forma de pagamento</label>
            <select name="payment" id="payment" {...register("payment")}>
              <option value="" disabled>Selecione...</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Pix">Pix</option>
              <option value="Cartão">Cartão</option>
            </select>
            <span id="error-alert-message">{errors?.payment?.message}</span>
          </div>
          <div className="input-row">
            <label htmlFor="block">Status</label>
            <select name="status" id="status" {...register("status")}>
              <option value="Novo Pedido">Novo Pedido</option>
              <option value="Saindo">Saindo</option>
              <option value="Entregue">Entregue</option>
            </select>
          </div>
          <div className="input-row">
            <label htmlFor="obs">Observações</label>
            <textarea 
              name="obs"
              id="obs" 
              rows="2"
              placeholder="Opcional"
              {...register("obs")} 
            />
            <span id="error-alert-message">{errors?.obs?.message}</span>
          </div>
          <div className="input-row buttons-wrapper">
            {
              updateProductId ?
              <>
                <button 
                  className={`update-button ${!isButtonsValid && 'disabled-button'}`}
                  onClick={() => updateSale()}
                >
                  <span>Atualizar</span>
                  <Export size={24} weight="duotone" />
                </button>
                <div id="delete-button" onClick={() => handleDeleteSale()}>
                  <span>Deletar</span>
                  <Trash size={24} weight="duotone" />
                </div>
              </> :
              <button 
                className={`register-button ${!isValid && 'disabled-button'}`}
                onClick={() => 
                  !isButtonsValid ?
                  notifyError("Preencha os dados") :
                  registerSale()
                }
              >
                <span>Salvar</span>
                <FloppyDisk size={24} weight="duotone" />
              </button>
            }
          </div>
        </div>
        <div className="cart-wrapper">
          <div className="cart-row" id="cart-input">
            <input type="number" defaultValue={1} {...register("cart-quantity")} />
            <select name="product-type" id="" defaultValue={''} {...register("cart-product")} >
              <option value="" disabled>Produto</option>
              <option value="Misto">Misto</option>
              <option value="Frango">Frango</option>
              <option value="Salsicha">Salsicha</option>
              <option value="Enroladinho">Enroladinho</option>
              <option value="Coxinha">Coxinha</option>
              <option value="Torta">Torta</option>
              <option value="Cebola">Pão de Cebola</option>
            </select>
            <PlusCircle 
              size={32} 
              weight={isPlusButtonDisabled ? "duotone" : "fill"}
              onClick={() => 
                isPlusButtonDisabled ?
                notifyError("insira um produto") :
                handleNewCartProduct()
              } 
            />
          </div>
          <div className="price-wrapper">
            {
              newSalePayment === "Dinheiro" &&
              <div className="change-wrapper">
                <label id="change-label" htmlFor="change">Troco pra quanto?</label>
                <CurrencyInput
                  id="change-input"
                  name="change"
                  placeholder="Valor do troco"
                  defaultValue={0}
                  allowDecimals={false}
                  allowNegativeValue={false}
                  maxLength={6}
                  intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                  value={isNaN(newSaleChange) === true ? '' : newSaleChange}
                  onValueChange={(value, name) => setNewSaleChange(Number(value))}
                />
              </div>
            }
            {
              discountShow &&
              <div className="input-row" id="discount-wrapper">
                <label htmlFor="discount">Desconto</label>
                <span id="currency-label">R$</span>
                <input type="number" id="discount" name="discount" {...register("discount")} />
              </div>
            }
            <div className="price-row">
              <span id="cart-total-price">Total: R$ {price}</span>
              <HandCoins size={24} weight={discountShow ? "fill" : "duotone"} onClick={() => setDiscountShow(current => !current)} />
            </div>
          </div>
          {
            cart?.map((product, index) => {
              return (
                <div className="cart-row cart-product" key={index}>
                  <span>{product.quantity} x</span>
                  <span>&nbsp;{product.product === "Cebola" && "Pão de "}{product.product}</span>
                  <MinusCircle size={28} weight="fill" onClick={() => handleDeleteCartProduct(product, index)} className="cart-delete-button" />
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}
