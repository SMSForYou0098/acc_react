import React,{memo,lazy,Suspense} from 'react'
const Index = lazy(() => import('../views/dashboard/index'))
const BoxedRouter = memo(() => {
    return (
        <Suspense fallback={<div className="react-load"></div>}>
            <Index />
        </Suspense>
    )
}
)

BoxedRouter.displayName="BoxedRouter"
export default BoxedRouter
